import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Content, Header, Page } from '@backstage/core-components';
import { XkcdComicCard } from 'backstage-plugin-xkcd';
import {
  HomePageCompanyLogo,
  HomePageStarredEntities,
  HomePageToolkit,
  TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none',
  },
}));

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const { container } = useLogoStyles();

  const tools = [
    {
      url: '/catalog?filters%5Bkind%5D=user',
      label: 'User Catalog',
      icon: <TemplateBackstageLogoIcon />,
    },
    {
      url: '/api-docs',
      label: 'Api',
      icon: <TemplateBackstageLogoIcon />,
    },
    {
      url: '/create/actions',
      label: 'Create/Actions',
      icon: <TemplateBackstageLogoIcon />,
    },
  ];

  return (
    <Page themeId="home">
      <Header title="Home" />
      <Content>
        <Grid container spacing={6} justifyContent="center">
          <HomePageCompanyLogo className={container} />
          <Grid container item xs={12} justifyContent="center">
            <HomePageSearchBar
              InputProps={{
                classes: {
                  root: classes.searchBarInput,
                  notchedOutline: classes.searchBarOutline,
                },
              }}
            />
          </Grid>
          <Grid container xs={12} justifyContent="center">
            <Grid item xs={12} md={3}>
              <HomePageStarredEntities />
              <HomePageToolkit tools={tools} />
            </Grid>
            <Grid item xs={12} md={3}>
              <XkcdComicCard />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const homePage = <HomePage />;
