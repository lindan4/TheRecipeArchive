import { Typography } from '@mui/material';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  useDocumentTitle('Error | The Recipe Archive');

  return (
    <div className={styles.errorPageContainer}>
      <Typography variant="h3" align="center">
        The page you requested does not exist.
      </Typography>
    </div>
  );
};

export default ErrorPage;
