interface Props {
  message: string;
}

const FatalError: React.FC<Props> = props => (
  <div className="h-64 w-64 bg-red-300">{props.message}</div>
);

export default FatalError;
