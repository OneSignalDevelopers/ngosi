interface Props {
  /** Name of the event or conference*/
  name: string;

  /** Where the event or conference is being hosted*/
  location: string;
}

const EventHeader: React.FC<Props> = ({ name, location }) => (
  <header className="flex flex-col flex-none px-8 py-2 h-16 bg-black">
    <h1 className="text-white font-bold text-2xl tracking-wide">{name}</h1>
    <p className="text-white text-xs">{location}</p>
  </header>
);

export default EventHeader;
