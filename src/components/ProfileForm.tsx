/* eslint-disable max-lines */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ChangeEvent, useEffect, useState } from 'react';
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
import { PROFILE_STAR_LABELS, PROFILE_SLIDER_MARKS } from '../constants/article-const';
import { getStarLabelText } from '../helpers/article-helper';

const ProfileForm = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const [, setShowToaster] = useState(false);

  const [uploadProvider, setUploadProvider] = useState<UploadFileParams['provider']>(reduxUserData.profile.uploadProvider);

  const {
    control, getValues, handleSubmit, reset, formState: { errors },
  } = useForm<Profile>({
    mode          : 'onTouched',
    reValidateMode: 'onChange',
    delayError    : 500,
    defaultValues : reduxUserData.profile,
  });

  const [starHover, setStarHover] = useState(-1);

  const [demoData, setDemoData] = useState<Profile>();

  const onSubmit: SubmitHandler<Profile> = (data) => {
    const newData = { ...data, uploadProvider };
    setDemoData(newData);
    reduxDispatch(userSlice.actions.updateProfileRequest(newData));
  };

  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
    if (event.target.files && event.target.files?.length > 0) {
      reduxDispatch(userSlice.actions.uploadAvatarRequest({
        file    : event.target.files[0],
        provider: uploadProvider,
      }));
      setShowToaster(true);
    }
  };

  const onChangeUploadProvider = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadProvider(event.target.value as UploadFileParams['provider']);
  };

  useEffect(() => {
    if (defaultProfileValues !== reduxUserData.profile) {
      reset(reduxUserData.profile); // reload page will not showing saved data if not reset
      setUploadProvider(reduxUserData.profile.uploadProvider);
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
              maxLength: { value: 20, message: 'Name must be at most 20 characters' },
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
          {/* an example of use normal Radio field together with react-hook-form */}
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
                field: { onChange, value },
              }) => (
                <FormControlLabel control={<Switch color="error" onChange={onChange} checked={value} />} label="Female" />
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
                  onChange={(event, val) => {
                    onChange(val); // ensure it's a number
                  }}
                  onChangeActive={(event, newHover) => {
                    setStarHover(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              )}
            />

            {getValues('starRating') !== null && (
              <Box sx={{ ml: 2 }}>
                {PROFILE_STAR_LABELS[starHover !== -1 ? starHover : getValues('starRating')]}

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
                marks={PROFILE_SLIDER_MARKS}
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
        {demoData && (
          <>
            <Typography paragraph variant="h5" component="div">
              Form Data after submit:
            </Typography>
            <Box component="pre" sx={{ margin: '1rem 4rem !important' }}>
              { JSON.stringify(demoData, null, ' ')}
            </Box>
          </>
        )}
      </Stack>

    </form>
  );
};

export default ProfileForm;
