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
            <Grid container spacing={1}>
                {items?.map((item: IItem) => {
                    return (
                        <Grid size={{ xs: 6, md: 2, lg: 3 }}>
                            <CardItem key={item.item_id} cardData={item} />
                        </Grid>
                    );
                })}
            </Grid>
        );
};
