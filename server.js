const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const axios = require('axios');

const app = express();
app.use(cors());

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB per file

app.post('/compare', upload.fields([{ name: 'month1' }, { name: 'month2' }]), async (req, res) => {
  try {
    if (!req.files || !req.files.month1 || !req.files.month2) {
      return res.status(400).json({ error: 'Both month1 and month2 files are required.' });
    }

    // Parse Excel files
    const wb1 = XLSX.read(req.files.month1[0].buffer, { type: 'buffer' });
    const wb2 = XLSX.read(req.files.month2[0].buffer, { type: 'buffer' });

    // Assume first sheet for both
    const data1 = XLSX.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]);
    const data2 = XLSX.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]]);

    // Simple comparative analysis
    const analysis = {
      month1: {
        rows: data1.length,
        columns: Object.keys(data1[0] || {}),
      },
      month2: {
        rows: data2.length,
        columns: Object.keys(data2[0] || {}),
      },
      comparison: {
        rowDifference: data2.length - data1.length,
        columnDifference: Object.keys(data2[0] || {}).length - Object.keys(data1[0] || {}).length,
        columnsInMonth1NotInMonth2: (Object.keys(data1[0] || {})).filter(col => !(Object.keys(data2[0] || {}).includes(col))),
        columnsInMonth2NotInMonth1: (Object.keys(data2[0] || {})).filter(col => !(Object.keys(data1[0] || {}).includes(col))),
      }
    };

    // Prepare a prompt for Qwen2.5 (Ollama)
    const prompt = `
I have two Excel sheets for two months. Here is a summary:
Month 1: ${analysis.month1.rows} rows, columns: ${analysis.month1.columns.join(', ')}
Month 2: ${analysis.month2.rows} rows, columns: ${analysis.month2.columns.join(', ')}
Row difference: ${analysis.comparison.rowDifference}
Column difference: ${analysis.comparison.columnDifference}
Columns in Month 1 not in Month 2: ${analysis.comparison.columnsInMonth1NotInMonth2.join(', ') || 'None'}
Columns in Month 2 not in Month 1: ${analysis.comparison.columnsInMonth2NotInMonth1.join(', ') || 'None'}

Please provide a brief comparative analysis and any insights you can infer from this summary.
    `;

    let qwenAnalysis = '';
    try {
      const ollamaRes = await axios.post(
        'http://localhost:11434/api/chat',
        {
          model: 'qwen2.5',
          messages: [{ role: 'user', content: prompt }]
        }
      );
      qwenAnalysis = ollamaRes.data.message.content;
    } catch (err) {
      console.error('Ollama API error:', err.response ? err.response.data : err.message);
      qwenAnalysis = 'Could not get analysis from Qwen2.5.';
    }

    res.json({ analysis, qwenAnalysis });
  } catch (error) {
    console.error('Excel analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze Excel files.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));