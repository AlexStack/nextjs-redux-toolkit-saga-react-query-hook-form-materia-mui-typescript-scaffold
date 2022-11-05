import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce } from 'react-use';

const SearchBar = () => {
  const nextJsRouter          = useRouter();
  const [keyword, setKeyword] = useState('');

  const onKeywordChange = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 1) {
      const keywordUpcase = trimmedKeyword.charAt(0).toUpperCase() + trimmedKeyword.slice(1);
      nextJsRouter.push(`/articles/tag/${keywordUpcase}`);
    }
  };

  useDebounce(onKeywordChange, 800, [keyword]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>

      <TextField
        id="search-bar-input"
        label="Search"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {keyword
                ? <CloseIcon onClick={() => setKeyword('')} sx={{ cursor: 'pointer' }} />
                : <Search />}
            </InputAdornment>
          ),
        }}
        variant="standard"
        value={keyword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value);
        }}
      />

    </Box>
  );
};

export default SearchBar;
