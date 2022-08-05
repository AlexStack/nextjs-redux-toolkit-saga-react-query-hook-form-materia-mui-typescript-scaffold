/* eslint-disable max-lines */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import Select from '@mui/material/Select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  FormControl, Stack, TextField, InputLabel, Box,
  FormControlLabel, FormLabel, Radio, RadioGroup, Rating,
  Switch, Checkbox, Slider, Typography, Button, Avatar, Tooltip, FormHelperText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import userSlice, { defaultProfileValues } from '../redux/features/userSlice';
import { ReduxState } from '../redux/store';
import { Profile, UploadFileParams, UserSliceType } from '../types/article-types';

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

function getStarLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${starLabels[value]}`;
}

// interface Profile {
//   firstName: string;
//   isFemale: boolean;
//   lastName?: string;
//   ageRange: number;
//   favoriteMaterialUI: boolean;
//   favoriteChakraUI: boolean;
//   favoriteSemanticUI: boolean;
//   favoriteAntDesign: boolean;
//   starRating: number;
//   yearsUsingReact: number;
// }

// const formDefaultValues: Profile = {
//   firstName : 'Your Name',
//   isFemale  : false,
//   ageRange  : 30,
//   starRating: 2.5,

//   favoriteMaterialUI: true,
//   favoriteChakraUI  : false,
//   favoriteSemanticUI: false,
//   favoriteAntDesign : true,
//   yearsUsingReact   : 1.5,

// };

const ProfileForm = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  // const profileData = reduxUserData.profile;
  // const [profileData, setProfileData] = React.useState<Profile>(reduxUserData.profile);

  const [, setShowToaster] = React.useState(false);

  const [uploadProvider, setUploadProvider] = React.useState<UploadFileParams['provider']>('imagekit');

  const {
    control, getValues, handleSubmit, watch, reset, formState: { errors },
  } = useForm<Profile>({
    mode          : 'onTouched',
    reValidateMode: 'onChange',
    delayError    : 500,
    defaultValues : reduxUserData.profile,
  });
  console.log('🚀 ~ file: ProfileForm.tsx ~ line 69 ~ ProfileForm ~ watch', watch('starRating'), reduxUserData.profile);

  const [starHover, setStarHover] = React.useState(-1);

  const [formData, setFormData] = React.useState<Profile>();

  const onSubmit: SubmitHandler<Profile> = (data) => {
    setFormData(data);
    reduxDispatch(userSlice.actions.updateProfileRequest(data));
  };

  const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
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
  };

  useEffect(() => {
    if (defaultProfileValues !== reduxUserData.profile) {
      reset(reduxUserData.profile); // reload page will not showing saved data if not reset
    }
  }, [reduxUserData.profile, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="column"
        // divider={<Divider orientation="horizontal" flexItem />}
        spacing={3}
        sx={{ width: '50rem' }}
      >

        {/* firstName & TextField/basic input */}
        <FormControl>
          <Controller
            name="firstName"
            control={control}
            rules={{
              required : 'Name is require',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
              maxLength: { value: 10, message: 'Name must be at most 10 characters' },
            }}
            render={({ field }) => <TextField label="Name" variant="standard" {...field} />}
          />
          <FormHelperText error>{errors.firstName?.message}</FormHelperText>
        </FormControl>

        {/* uploadAvatar & RadioGroup */}
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
        </Stack>

        {/* gender & Switch */}
        <FormControl>
          <FormLabel id="demo-upload-provider-radio-group-label">Gender</FormLabel>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Male</Typography>
            <Controller
              control={control}
              name="isFemale"
              render={({
                field: { onChange },
              }) => (
                <FormControlLabel control={<Switch color="error" onChange={onChange} />} label="Female" />
              )}
            />

          </Stack>
        </FormControl>

        {/* age & Select */}
        <FormControl>
          <Controller
            name="ageRange"
            control={control}
            render={({ field }) => (
              <FormControl variant="standard" sx={{ minWidth: 220 }}>
                <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Age"
                >
                  <MenuItem value={0}>
                    <em>Do not want to say</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten - Twenty</MenuItem>
                  <MenuItem value={20}>Twenty - Thirty</MenuItem>
                  <MenuItem value={30}>Thirty - Forty</MenuItem>
                  <MenuItem value={40}>Forty - Fifty</MenuItem>
                  <MenuItem value={50}>Fifty+</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </FormControl>

        {/* favorite ui & Checkbox */}
        <FormControl>
          <FormControlLabel
            label="What's your favorite React UI library"
            control={(
              <Checkbox
                checked={getValues('favoriteMaterialUI') && getValues('favoriteChakraUI') && getValues('favoriteAntDesign') && getValues('favoriteSemanticUI')}
                indeterminate={getValues('favoriteMaterialUI') || getValues('favoriteChakraUI') || getValues('favoriteAntDesign') || getValues('favoriteSemanticUI')}
                // onChange={handleChange1}
                color="error"
              />
            )}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <Controller
              control={control}
              name="favoriteMaterialUI"
              render={({
                field: { onChange, value },
              }) => (
                <FormControlLabel
                  label="Material-UI"
                  control={<Checkbox checked={value} onChange={onChange} color="success" />}
                />
              )}
            />
            <Controller
              control={control}
              name="favoriteChakraUI"
              render={({
                field: { onChange, value },
              }) => (
                <FormControlLabel
                  label="Chakra UI"
                  control={<Checkbox checked={value} onChange={onChange} color="default" />}
                />
              )}
            />

            <Controller
              control={control}
              name="favoriteAntDesign"
              render={({
                field: { onChange, value },
              }) => (
                <FormControlLabel
                  label="Ant Design"
                  control={<Checkbox checked={value} onChange={onChange} color="secondary" />}
                />
              )}
            />

            <Controller
              control={control}
              name="favoriteSemanticUI"
              render={({
                field: { onChange, value },
              }) => (
                <FormControlLabel
                  label="Semantic UI"
                  control={<Checkbox checked={value} onChange={onChange} color="warning" />}
                />
              )}
            />

          </Box>
        </FormControl>

        {/* 5-star & Rating */}
        <Stack direction="row" spacing={1} alignItems="left">
          <Typography>Do you think this NextJs Redux ReactHookForm example is helpful?</Typography>
          <Box
            sx={{
              width     : 200,
              display   : 'flex',
              alignItems: 'center',
            }}
          >
            <Controller
              control={control}
              name="starRating"
              render={({
                field: { onChange, value },
              }) => (
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={0.5}
                  getLabelText={getStarLabelText}
                  onChange={onChange}
                  onChangeActive={(event, newHover) => {
                    setStarHover(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              )}
            />

            {getValues('starRating') !== null && (
              <Box sx={{ ml: 2 }}>
                {starLabels[starHover !== -1 ? starHover : getValues('starRating')]}

              </Box>
            )}
          </Box>
        </Stack>

        {/* yearsUsingReact & Slider */}
        <FormControl>
          <Typography paragraph variant="subtitle1" component="div">
            How long have you been using React? (
            {`${getValues('yearsUsingReact')} years`}
            )
          </Typography>
          <Controller
            control={control}
            name="yearsUsingReact"
            render={({
              field: { onChange, value },
            }) => (
              <Slider
                aria-label="Always visible"
                onChange={onChange}
                value={value}
                max={20}
                step={0.1}
                marks={sliderMarks}
                valueLabelDisplay="on"
                sx={{ marginLeft: '1.5rem', width: '85vh' }}
              />
            )}
          />

        </FormControl>

        {/* submit button */}
        <FormControl>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ margin: '3rem 0', maxWidth: '20rem' }}
          >
            Send
          </Button>
        </FormControl>

        {/* display form data results after submit */}
        {formData && (
          <>
            <Typography paragraph variant="h5" component="div">
              Form Data after submit:
            </Typography>
            <Box component="pre" sx={{ margin: '1rem 4rem !important' }}>
              { JSON.stringify(formData, null, ' ')}
            </Box>
          </>
        )}
      </Stack>

    </form>
  );
};

export default ProfileForm;
