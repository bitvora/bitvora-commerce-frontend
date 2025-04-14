'use client';
import ReactJson from 'react-json-view';

export const PrettyJson = ({ data }) => {
  return (
    <div className="w-full max-h-[300px] overflow-auto h-full">
      <ReactJson
        src={data}
        theme="apathy"
        // enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        quotesOnKeys={false}
      />
    </div>
  );
};
