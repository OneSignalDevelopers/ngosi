import Image from 'next/image'
import presenter from '../public/images/presenter.jpg'

interface Props {
  /** The presenter's first name */
  firstName: string

  /** The presenter's last name */
  lastName: string

  /** The title of the presentation */
  title: string
}

const PresentationInfo: React.FC<Props> = ({ firstName, lastName, title }) => (
  <div className="flex flex-col space-y-2">
    <h2 className="capitalize font-semibold text-lg">
      {firstName} {lastName}
    </h2>
    <div className="flex">
      <div className="h-28 w-28 relative flex-none">
        {" "}
        <Image
          src={presenter}
          alt="Photo of presenter"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p className="ml-2 px-2 overflow-ellipsis max-h-28">{title}</p>
    </div>
  </div>
);

export default PresentationInfo
