import {
    FormControl,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
    useState,
    ChangeEvent,
    Dispatch,
    SetStateAction,
    FormEvent,
    MouseEvent,
} from "react";

interface Props {
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({ setSearchQuery }: Props) => {
    const [searchString, setSearchString] = useState<string>("");

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement> | MouseEvent) => {
        event.preventDefault();
        console.log(searchString);
        setSearchQuery(searchString);
        setSearchString("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl variant="outlined" fullWidth>
                <TextField
                    id="search-bar"
                    className="text"
                    label="Search"
                    onInput={handleInput}
                    variant="outlined"
                    placeholder="Search..."
                    value={searchString}
                    size="small"
                    color="primary"
                    sx={{
                        margin: "10px auto",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "50px",
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton type="submit">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                    fullWidth
                />
            </FormControl>
        </form>
    );
};

export default SearchBar;
