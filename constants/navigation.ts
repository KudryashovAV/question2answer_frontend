type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'Questions',
  },
  {
    imgURL: '/assets/icons/users.svg',
    route: '/community',
    label: 'Users',
  },
  // {
  //   imgURL: '/assets/icons/star.svg',
  //   route: '/collection',
  //   label: 'Collections',
  // },
  // {
  //   imgURL: '/assets/icons/suitcase.svg',
  //   route: '/jobs',
  //   label: 'Find Jobs',
  // },
  {
    imgURL: '/assets/icons/tag.svg',
    route: '/tags',
    label: 'Tags',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/profile',
    label: 'Profile',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/ask-question',
    label: 'Ask a question',
  },
];
