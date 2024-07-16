import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputAdornment, OutlinedInput, Box } from '@mui/material';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // const handleSearchChange = (event) => {
  //   const newSearchTerm = event.target.value;
  //   setSearchTerm(newSearchTerm);
  //   if (newSearchTerm.trim() !== '') {
  //     if(location.pathname == '/userslist'){
  //       navigate(`/userslist?search=${newSearchTerm}`);
  //     }else if(location.pathname == '/dashboard')
  //       navigate(`/imageslider?search=${newSearchTerm}`);
  //       console.log("log");
  //   }
  // };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() !== '') {
      if (location.pathname === '/userslist') {
        navigate(`/userslist?search=${newSearchTerm}`);
      } else if (location.pathname === '/imageslider') {
        navigate(`/imageslider?search=${newSearchTerm}`);
      }
    }
  };


  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'search'
          }}
          placeholder="Ctrl + K"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
