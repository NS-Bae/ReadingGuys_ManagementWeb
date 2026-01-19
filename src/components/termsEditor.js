import React from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TermsMarkdownEditor = ({ title, value, onChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">{title}</Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                {/* 왼쪽: 입력 */}
                <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                    편집 (Markdown)
                </Typography>
                <TextField
                    multiline
                    minRows={18}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`# 제목\n\n여기에 마크다운으로 작성해줘...`}
                    fullWidth
                />
                </Paper>
                {/* 오른쪽: 미리보기 */}
                <Paper variant="outlined" sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                        미리보기
                    </Typography>

                <Box sx={{ lineHeight: 1.7 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value || '*미리볼 내용이 아직 없어…*'}
                    </ReactMarkdown>
                </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default TermsMarkdownEditor;