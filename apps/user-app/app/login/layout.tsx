import LoginPage from "../../components/LoginPage";

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element {
    return (
      <div>
        {/* <LoginPage /> */}
        {children}
      </div>
    );
  }