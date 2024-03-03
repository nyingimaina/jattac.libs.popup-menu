import React, { Component, ReactNode } from 'react';

interface JattacPopupMenuProps {
  isOpen: boolean;
  onClose: (index?: number) => void;
  children: ReactNode;
}

interface JattacPopupMenuState {
  position: { x: number; y: number };
}

const JattacPopupMenuId = 'Jattac-popup-menu';

export default class JattacPopupMenu extends Component<JattacPopupMenuProps, JattacPopupMenuState> {
  // private isOpenChangeTimer: number | null = null;

  constructor(props: JattacPopupMenuProps) {
    super(props);
    this.state = {
      position: { x: 0, y: 0 },
    };
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.props.isOpen) {
      this.onCloseProxy();
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.onMouseClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  onMouseLeave = () => {
    if (this.props.isOpen) {
      this.onCloseProxy();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.onMouseClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  shouldComponentUpdate(nextProps: Readonly<JattacPopupMenuProps>, nextState: Readonly<JattacPopupMenuState>): boolean {
    return this.props.isOpen !== nextProps.isOpen || this.state.position !== nextState.position;
  }

  // componentDidUpdate(prevProps: JattacPopupMenuProps) {
  //   if (prevProps.isOpen !== this.props.isOpen) {
  //     if (this.isOpenChangeTimer) {
  //       clearTimeout(this.isOpenChangeTimer);
  //     }

  //     this.isOpenChangeTimer = window.setTimeout(() => {
  //       this.isOpenChangeTimer = null;
  //     }, 1000);
  //   }
  // }

  private get isNotZeroPosition(): boolean {
    return this.state.position.x !== 0 || this.state.position.y !== 0;
  }

  onMouseClick = (e: globalThis.MouseEvent) => {
    if (this.isNotZeroPosition && this.handleOutsideClick(e)) {
      return;
    } else {
      this.handleClick(e);
    }
  };

  handleClick = (e: globalThis.MouseEvent): boolean => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.isOpen === false) return false;
    // if (this.isOpenChangeTimer) {
    //   return; // Ignore the click since we're throttling isOpen changes
    // }

    this.setState({
      position: { x: e.clientX - 100, y: e.clientY },
    });
    return true;
  };

  private onCloseProxy = (index?: number) => {
    this.setState(
      {
        position: { x: 0, y: 0 },
      },
      () => this.props.onClose(index),
    );
  };

  handleOutsideClick = (e: globalThis.MouseEvent): boolean => {
    const { isOpen } = this.props;
    if (isOpen && !(e.target as HTMLElement).closest('#' + JattacPopupMenuId)) {
      this.onCloseProxy();
      return true;
    }
    return false;
  };

  calculateMenuPosition = () => {
    const { isOpen } = this.props;
    const { position } = this.state;
    const windowHeight = window.innerHeight;
    const menuHeight = 30 * React.Children.count(this.props.children); // Assuming each menu item is 30px tall

    if (isOpen && position.y + menuHeight > windowHeight) {
      // If opening downwards would cause the menu to be hidden, open it upwards
      return {
        top: position.y - menuHeight,
        bottom: 'auto',
      };
    }

    // Open the menu downwards by default
    return {
      top: position.y,
      bottom: 'auto',
    };
  };

  render() {
    const { isOpen, children } = this.props;

    return (
      <div id={JattacPopupMenuId}>
        {isOpen ? (
          <div
            style={{
              position: 'fixed',
              left: this.state.position.x,
              ...this.calculateMenuPosition(),
              background: 'white',
              border: '1px solid #ccc',
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                onClick={() => {
                  // You can perform any action you want here when a menu item is clicked
                  //console.log("Clicked on:", child.props.children);
                  this.onCloseProxy(index);
                }}
              >
                {child}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
