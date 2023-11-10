import ConfigurationRouter from "./util/ConfigurationRouter"

const Root = () => {
  return (
    <div className='w-full h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 justify-center items-center'>
      <ConfigurationRouter/>
    </div>
  )
}

export default Root