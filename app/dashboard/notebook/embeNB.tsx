import React from 'react';

interface NoteBookProps {
  notebookUrl: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const NoteBook: React.FC<NoteBookProps> = ({ notebookUrl, iframeRef }) => {
  return (
    <iframe
      ref={iframeRef}
      src={notebookUrl}
      width="100%"
      height="600px"
      style={{
        border: 'none',
        backgroundColor: '#fff',
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      title="Notebook"
    />
  );
};

export default NoteBook;