import React from "react";

interface InputBoxProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
}

const InputBox: React.FC<InputBoxProps> = ({ input, setInput, handleSubmit }) => {
  return (
    <div>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={5}
        placeholder="Adivina la palabra..."
      />
      <button
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Adivinar
      </button>
    </div>
  );
};

export default InputBox;
