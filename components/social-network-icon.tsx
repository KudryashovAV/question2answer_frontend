import { SocialIcon } from "react-social-icons";

interface Props {
  link: string;
  typeUrl: string;
}

const SocialNetworkIcon = ({ link, typeUrl }: Props) => {
  return (
    <>
      {link && (
        <SocialIcon
          className="mr-2"
          style={{ width: "40px", height: "40px" }}
          url={typeUrl}
          href={link}
        />
      )}
    </>
  );
};

export default SocialNetworkIcon;
