import React from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TermsMarkdownEditor = ({ title, value, onChange }) => {
    return (
        <Box style = { BigBox }>
            <Typography variant="h6">{title}</Typography>
            <Box style={ SmallBox }>
                <Paper variant="outlined" style={ EditorPlace }>
                    <Typography variant="subtitle2" style={ HeadLine }>
                        편집 (Markdown)
                    </Typography>
                    <TextField
                        multiline
                        minRows={18}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`# 제목\n\n여기에 마크다운방식으로 작성 부탁합니다.`}
                        fullWidth
                    />
                </Paper>
                <Paper variant="outlined" style={ EditorPlace }>
                    <Typography variant="subtitle2" style={ HeadLine }>
                        미리보기
                    </Typography>
                    <Box>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {value || '*미리볼 내용이 아직 없습니다.'}
                        </ReactMarkdown>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default TermsMarkdownEditor;

const BigBox = {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '2px',
    backgroundColor: 'white'
};
const SmallBox = {
    display: 'flex',
    gap: '20px',
    alignItems: 'stretch'
};
const EditorPlace = {
    flex: '1 1 360px',
    padding: '2px',
};
const HeadLine = {
    marginTop: '10px',
    marginBottom: '10px',
    opacity: 0.8,
};