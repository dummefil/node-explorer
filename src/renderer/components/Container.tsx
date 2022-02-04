import PropTypes from 'prop-types';

type ComponentProps = {
  children?: React.ReactNode;
  column?: boolean;
  row?: boolean;
};

export default function Container(props: ComponentProps) {
  const { children, column, row } = props;
  // TODO: REFACTOR ME
  let className = 'Container';
  if (column) {
    className += ' ContainerColumn';
  }
  if (row) {
    className += ' ContainerRow';
  }
  return <div className={className}>{children && children}</div>;
}

Container.defaultProps = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  column: undefined,
  row: undefined,
};
