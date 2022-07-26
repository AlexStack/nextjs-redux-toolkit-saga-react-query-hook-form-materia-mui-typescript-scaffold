/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Select from '@mui/material/Select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  FormControl, Stack, TextField, InputLabel, Box,
  FormControlLabel, FormLabel, Radio, RadioGroup,
  Switch, Checkbox, Slider, Typography, Button, Avatar, Tooltip,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import userSlice from '../redux/features/userSlice';
import { ReduxState } from '../redux/store';
import { UserSliceType } from '../types/article-types';

interface IFormInput {
  firstName: string;
  lastName: string;
  iceCreamType: { label: string; value: string };
}

const ProfileForm = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  // const profileData = reduxUserData.profile;

  const [, setShowToaster] = React.useState(false);

  const { control, handleSubmit } = useForm<IFormInput>();

  const [checked, setChecked] = React.useState([true, false]);

  const sliderMarks = [
    {
      value: 1,
      label: '1 year',
    },
    {
      value: 5,
      label: '5 year',
    },
    {
      value: 10,
      label: '10 years',
    },
  ];

  // function valuetext(value: number) {
  //   return `${value}°C`;
  // }

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files?.length > 0) {
      reduxDispatch(userSlice.actions.uploadAvatarRequest(event.target.files[0]));
      setShowToaster(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="column"
        // divider={<Divider orientation="horizontal" flexItem />}
        spacing={3}
        sx={{ width: '50rem' }}
      >

        <FormControl>

          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField label="Name" variant="standard" {...field} />}
          />
        </FormControl>

        <Stack direction="row">
          {reduxUserData.profile.avatarUrl && (
            <Avatar
              src={reduxUserData.profile.avatarUrl}
              sx={{
                width: 80, height: 80, cursor: 'default', marginRight: '1rem',
              }}

            />

          )}
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: '10rem' }}
          >
            <Tooltip title="Upload an image as your avatar" placement="right">
              <Avatar
                alt="Alex Sharp"
                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                component="label"
              >
                <PhotoCamera />
                <input hidden accept="image/*" type="file" onChange={uploadAvatar} />
              </Avatar>
            </Tooltip>
            <Typography variant="caption">
              {reduxUserData.status === 'loading' ? 'Uploading...' : 'Choose an image'}
            </Typography>
          </Stack>

        </Stack>

        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="female" control={<Radio />} label="I'm not Female" />
            <FormControlLabel value="male" control={<Radio />} label="I'm not Male" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <Controller
            name="iceCreamType"
            control={control}
            render={({ field }) => (
              <FormControl variant="standard" sx={{ minWidth: 220 }}>
                <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={20}
                  // onChange={handleChange}
                  label="Age"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </FormControl>

        <FormControl>
          <FormControlLabel
            label="What's your favorite React UI library"
            control={(
              <Checkbox
                checked={checked[0] && checked[1]}
                indeterminate={checked[0] !== checked[1]}
                onChange={handleChange1}
                color="error"
              />
            )}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
              label="Material-UI"
              control={<Checkbox checked={checked[0]} onChange={handleChange2} color="success" />}
            />
            <FormControlLabel
              label="Chakra UI"
              control={<Checkbox checked={checked[1]} onChange={handleChange3} color="default" />}
            />

            <FormControlLabel
              label="Ant Design"
              control={<Checkbox checked={checked[1]} onChange={handleChange3} color="secondary" />}
            />

            <FormControlLabel
              label="Semantic UI"
              control={<Checkbox checked={checked[1]} onChange={handleChange3} color="warning" />}
            />
          </Box>
        </FormControl>

        <FormControlLabel control={<Switch defaultChecked={false} />} label="I used Redux Saga before" />

        <FormControl>
          <Typography paragraph variant="subtitle1" component="div">
            How long have you been using React?
          </Typography>
          <Slider
            aria-label="Always visible"
            defaultValue={1}
            max={20}
            // getAriaValueText={valuetext}
            step={0.1}
            marks={sliderMarks}
            valueLabelDisplay="on"
            sx={{ margin: '0 1rem' }}
          />
        </FormControl>

        <FormControl>
          <Button variant="contained" endIcon={<SendIcon />} sx={{ margin: '3rem 0', maxWidth: '20rem' }}>
            Send
          </Button>
        </FormControl>
      </Stack>

    </form>
  );
};

export default ProfileForm;
