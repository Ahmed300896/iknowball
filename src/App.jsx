import NicknameScreen from './components/NicknameScreen'

export default function App() {
  function handleNicknameSubmit(nickname) {
    console.log('nickname:', nickname)
  }

  return <NicknameScreen onSubmit={handleNicknameSubmit} />
}
