import { PublicUrl } from '@common/constants'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import QRCode from 'react-qr-code'

const downloadQRCode = (e: React.MouseEvent) => {
  console.log('This feature is not implemented yet.')
}

const Qr: NextPage = () => {
  const router = useRouter()

  const { preso } = router.query
  if (!preso || typeof preso !== 'string') {
    return <div>Preso ID is missing</div>
  }

  return (
    <>
      <QRCode value={`${PublicUrl}/survey/${preso}`} />
      <button
        className="w-80 h-14 bg-black text-white font-bold text-xl mt-24"
        type="button"
        onClick={downloadQRCode}
      >
        Download QR
      </button>
      <button
        className="w-80 h-14 bg-black text-white font-bold text-xl mt-5"
        type="button"
        onClick={() => {
          router.push('/presos')
        }}
      >
        Continue to your presos
      </button>
    </>
  )
}

export default Qr
