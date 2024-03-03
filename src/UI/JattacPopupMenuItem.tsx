import React, { CSSProperties, PureComponent } from 'react';
import css from '../Styles/JattacPopupMenuItem.module.css';

interface IProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const styles = {
  hoverStyle: {
    backgroundColor: '#00F',
    color: '#FFF',
  } as CSSProperties,
};

interface IState {
  isHovered: boolean;
}

export default class JattacPopupMenuItem extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  render() {
    const style = {
      cursor: 'pointer',
      padding: '8px',
    };

    const effectiveStyle = this.state.isHovered ? { ...style, ...styles.hoverStyle } : style;
    return (
      <div
        onMouseEnter={() => {
          if (this.props.disabled === true) {
            return;
          }
          this.setState({ isHovered: true });
        }}
        onMouseLeave={() => {
          if (this.props.disabled === true) {
            return;
          }
          this.setState({ isHovered: false });
        }}
        style={effectiveStyle}
        onClick={() => {
          if (this.props.disabled === true) {
            return;
          }
          this.props.onClick();
        }}
        className={this.props.disabled === true ? css.disabled : ''}
      >
        {this.props.children}
      </div>
    );
  }
}
