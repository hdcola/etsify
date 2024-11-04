import CardItem from '../components/CardItem';
import { useAppContext } from '../App';
import useGetItems from '../api/useGetItems';
import type { IItem } from '../api/useGetItems';
import Grid from '@mui/material/Grid2';

export const Home = () => {
    const { isInit } = useAppContext();
    const { isLoading, data: { items } = {} } = useGetItems(isInit);

    if (!isLoading)
        return (
            <Grid container spacing={2} px={1}>
                {items?.map((item: IItem) => {
                    return (
                        <Grid
                            key={item.item_id}
                            size={{ xs: 12, sm: 6, md: 3 }}
                        >
                            <CardItem cardData={item} />
                        </Grid>
                    );
                })}
            </Grid>
        );
};
