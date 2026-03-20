import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RandomRecipeItem, SearchBar } from '../components';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import mainStyles from './Main.module.css';

const Main = () => {
  const navigate = useNavigate();
  useDocumentTitle('Home | The Recipe Archive');

  return (
    <div className={mainStyles.mainContainer}>
      <Box className={mainStyles.heroGrid}>
        <section>
          <Typography variant="h2" component="h1" className={mainStyles.heroTitle}>
            The Recipe Archive
          </Typography>
          <Typography className={mainStyles.heroSubtitle}>
            Find your next meal, save favourites, and build your personal cookbook.
          </Typography>
        </section>
        <section className={mainStyles.sectionSpacing}>
          <div className={mainStyles.searchWrap}>
            <SearchBar
              onSearchPress={(value) => {
                navigate(`/search?keyword=${encodeURIComponent(value)}`);
              }}
            />
          </div>
        </section>
        <section className={mainStyles.sectionSpacing}>
          <RandomRecipeItem buildTo={(id) => `/meal?id=${id}`} />
        </section>
      </Box>
    </div>
  );
};

export default Main;
