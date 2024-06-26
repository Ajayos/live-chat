import React from "react";
import Login from "./Login";
import Main from "./Main";

function App() {
  const [name, setName] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(false);

  React.useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedUuid = localStorage.getItem("uuid");

    if (storedName && storedUuid && storedUuid.length > 0 && storedName.length > 0) {
      setName(storedName);
      setIsLogin(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLogin(true);
  };

  if (isLogin) {
    return <Main name={name} />;
  } else
    return <Login setName={setName} name={name} handleSubmit={handleSubmit} />;
}

export default App;
