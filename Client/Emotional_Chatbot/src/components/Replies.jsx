import { BsReply } from "react-icons/bs";
function Replies({ Data, inputRef }) {
  function handleClick() {
    inputRef.current.value = Data;
    inputRef.current.focus();
  }
  return (
    <div className="replies" onClick={handleClick}>
      <span>
        <BsReply size={20} />
        &nbsp;&nbsp;
      </span>
      {Data}
    </div>
  );
}
export default Replies;
