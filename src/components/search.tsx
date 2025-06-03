import { alpha, InputBase, styled } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


interface SearchProps {
    onSearch: (value: string) => void;
}

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },
}));

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };
    
    return (
        <SearchContainer>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleChange}
            />
        </SearchContainer>
    );
};

export default Search;