import { Alert, Button, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  INVALID_CREDENTIALS,
  NAME_CHANGE_ERROR,
  NAME_CHANGE_SUCCESS,
  PASSWORDS_SAME,
  PASSWORD_CHANGE_SUCCESS,
  SECONDARY_COLOUR
} from '../../../shared/constants';
import { updateFBName, updateFBPassword } from '../../user/api/userApi';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import { useAppSelector } from '../../user/state/hooks';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const name = useAppSelector((state) => state.user.name);

  const [enteredName, setEnteredName] = useState(name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useDocumentTitle('Profile | The Recipe Archive');

  useEffect(() => {
    const authLocal = localStorage.getItem('authUser');
    if (!authLocal) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setEnteredName(name);
  }, [name]);

  const hasPasswordFormData = useMemo(
    () => Boolean(currentPassword && newPassword && confirmNewPassword),
    [currentPassword, newPassword, confirmNewPassword]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const tasks: Promise<string>[] = [];

    if (enteredName.trim() && enteredName.trim() !== name) {
      tasks.push(updateFBName(enteredName.trim()));
    }

    if (hasPasswordFormData) {
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('The new passwords do not match.');
        return;
      }

      tasks.push(updateFBPassword(currentPassword, newPassword));
    }

    if (tasks.length === 0) {
      setErrorMessage('No profile changes were provided.');
      return;
    }

    const results = await Promise.allSettled(tasks);

    const successTokens: string[] = [];
    const errorTokens: string[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value === NAME_CHANGE_SUCCESS) {
          successTokens.push('Successfully changed your display name.');
        }
        if (result.value === PASSWORD_CHANGE_SUCCESS) {
          successTokens.push('Your password has been updated.');
        }
      } else {
        const reasonMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);

        if (reasonMessage.includes(NAME_CHANGE_ERROR)) {
          errorTokens.push('Unable to change name. Please try again.');
        } else if (reasonMessage.includes(INVALID_CREDENTIALS)) {
          errorTokens.push('Current password is incorrect.');
        } else if (reasonMessage.includes(PASSWORDS_SAME)) {
          errorTokens.push('Current and new password cannot be the same.');
        } else {
          errorTokens.push('Could not update profile due to an unexpected error.');
        }
      }
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSuccessMessage(successTokens.join(' '));
    setErrorMessage(errorTokens.join(' '));
  };

  return (
    <div className={styles.outerProfileContainer}>
      <div className={styles.profileCard}>
        <Typography variant="h4" className={styles.profileTitle}>
          Profile Settings
        </Typography>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Name
            </Typography>
            <TextField fullWidth value={enteredName} onChange={(event) => setEnteredName(event.target.value)} />
          </div>

          <div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              sx={{ pb: 2 }}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              label="Current Password"
            />
            <TextField
              fullWidth
              type="password"
              sx={{ pb: 2 }}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              label="New Password"
            />
            <TextField
              fullWidth
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              label="Confirm New Password"
            />
          </div>

          <Button type="submit" variant="contained" sx={{ bgcolor: SECONDARY_COLOUR, width: 'fit-content' }}>
            Apply Changes
          </Button>
        </form>

        {errorMessage && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{successMessage}</Alert>}
      </div>
    </div>
  );
};

export default Profile;
