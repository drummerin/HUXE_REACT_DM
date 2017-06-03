import React from 'react';

const styles = {
  element: {
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  img: {
    width: 100,
  },
};

// dynamisch je nach ausgewähltem sender :)
const MenuHeader = () => (
    <div style={styles.element}>
        <img style={styles.img} src={'/assets/huxeLogo.png'}/>
    </div>
);

export default MenuHeader;
