import styles from "~/styles/components/header.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const Header = () => {
  return (
    <header>
      <div className="title">Package Lock Explorer</div>
    </header>
  );
};
