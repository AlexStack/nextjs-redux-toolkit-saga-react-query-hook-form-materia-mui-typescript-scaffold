import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { Article, UserSliceType } from '../types/article-types';
import { getArticleImgUrl } from '../helpers/article-helper';
import userSlice from '../redux/features/userSlice';
import { ReduxState } from '../redux/store';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform : !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  article: Article;
}

const ArticleDetail = ({ article }:Props) => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const [expanded, setExpanded] = useState(true);

  const isFavorite = reduxUserData.favoriteItems.some((item) => item.id === article.id);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onClickFavorite = () => {
    reduxDispatch(userSlice.actions.favoriteItemRequest(article));
  };

  return (
    <Card sx={{ maxWidth: 1000, marginTop: 5 }}>
      <CardHeader
        avatar={(
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={article.user.profile_image_90}
          >
            R
          </Avatar>
        )}
        action={(
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        )}
        title={article.title}
        subheader={`${article.user.name} - ${article.published_at}`}
      />
      <CardMedia
        component="img"
        height="300"
        image={getArticleImgUrl(article)}
        alt={article.title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {article.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          color={isFavorite ? 'error' : 'default'}
          onClick={onClickFavorite}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph component="h1">{article.title}</Typography>
          <Typography paragraph component="div">
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: article.body_html || '' }}
            />
          </Typography>
        </CardContent>
      </Collapse>
      <Fab
        aria-label="like"
        sx={{
          position: 'fixed',
          bottom  : (theme) => theme.spacing(5),
          right   : (theme) => theme.spacing(5),
        }}
        color={isFavorite ? 'error' : 'default'}
        onClick={onClickFavorite}
      >
        <Tooltip
          title={isFavorite ? 'Remove this article from my favorites' : 'Favorite this article!'}
          placement="left"
          PopperProps={{
            modifiers: [
              {
                name   : 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ],
          }}
        >
          <FavoriteIcon />
        </Tooltip>
      </Fab>

    </Card>
  );
};

export default ArticleDetail;
