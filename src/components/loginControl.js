
import { LoginButton, ButtonWrapper } from './loginControlStyle.ts';

const LoginControl = ({ handleLogout }) => {

  return (
    <ButtonWrapper  >
      <LoginButton id = 'logout' onClick={handleLogout}>로그아웃</LoginButton>
    </ButtonWrapper>
  )

}

export default LoginControl;