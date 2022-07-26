/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Select from '@mui/material/Select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  FormControl, Stack, TextField, InputLabel, Box,
  FormControlLabel, FormLabel, Radio, RadioGroup, Rating,
  Switch, Checkbox, Slider, Typography, Button, Avatar, Tooltip,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import userSlice from '../redux/features/userSlice';
import { ReduxState } from '../redux/store';
import { UploadFileParams, UserSliceType } from '../types/article-types';

const starLabels: { [index: string]: string } = {
  0.5: 'Useless',
  1  : 'Useless+',
  1.5: 'Poor',
  2  : 'Poor+',
  2.5: 'Ok',
  3  : 'Ok+',
  3.5: 'Good',
  4  : 'Good+',
  4.5: 'Excellent',
  5  : 'Excellent+',
};

function getStarLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${starLabels[value]}`;
}

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

  const [uploadProvider, setUploadProvider] = React.useState<UploadFileParams['provider']>('imagekit');

  const { control, handleSubmit } = useForm<IFormInput>();

  const [checked, setChecked] = React.useState([true, false]);

  const [starValue, setStarValue] = React.useState<number | null>(2);
  const [starHover, setStarHover] = React.useState(-1);

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
      reduxDispatch(userSlice.actions.uploadAvatarRequest({
        file    : event.target.files[0],
        provider: uploadProvider,
      }));
      setShowToaster(true);
    }
  };

  const onChangeUploadProvider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadProvider(event.target.value as UploadFileParams['provider']);
    console.log('🚀 ~ file: ProfileForm.tsx ~ line 81 ~ onChangeUploadProvider ~ event', event.target.value);
    // setChecked(event.target.checked);
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
            <Tooltip title="Upload an image as your avatar" placement="top">
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

          <RadioGroup
            row={false}
            defaultValue="imagekit"
            value={uploadProvider}
            aria-labelledby="upload-provider-radio-group-label"
            name="upload-provider-radio-group"
            onChange={onChangeUploadProvider}
          >
            <FormControlLabel value="cloudinary" control={<Radio color="primary" />} label="Upload to Cloudinary" />
            <FormControlLabel value="imagekit" control={<Radio color="success" />} label="Upload to ImageKit" />
          </RadioGroup>

          {/* <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Upload to Cloudinary</Typography>
            <Switch defaultChecked={false}
            onChange={onChangeUploadProvider} inputProps={{ 'aria-label': 'ant design' }} />
            <Typography>Upload to ImageKit</Typography>
          </Stack> */}

        </Stack>

        <FormControl>
          <FormLabel id="demo-upload-provider-radio-group-label">Gender</FormLabel>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Male</Typography>
            {/* <Switch defaultChecked inputProps={{ 'aria-label': 'Choose gender' }} />
            <Typography>Male</Typography> */}
            <FormControlLabel control={<Switch color="error" />} label="Female" />
          </Stack>
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

        <Stack direction="row" spacing={1} alignItems="left">
          <Typography>Do you think this NextJs Redux ReactHookForm example is helpful?</Typography>
          <Box
            sx={{
              width     : 200,
              display   : 'flex',
              alignItems: 'center',
            }}
          >
            <Rating
              name="hover-feedback"
              value={starValue}
              precision={0.5}
              getLabelText={getStarLabelText}
              onChange={(event, newValue) => {
                setStarValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setStarHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {starValue !== null && (
              <Box sx={{ ml: 2 }}>{starLabels[starHover !== -1 ? starHover : starValue]}</Box>
            )}
          </Box>
        </Stack>

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
