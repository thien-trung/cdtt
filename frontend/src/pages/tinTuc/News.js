import React, { useEffect, useRef } from 'react';

const News = () => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        const onLoad = () => {
            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                // Chèn CSS để ẩn phần header và footer
                const style = document.createElement('style');
                style.innerHTML = `
                    .header, .footer, .some-specific-class {
                        display: none !important;
                    }
                `;
                iframeDocument.head.appendChild(style);
            } catch (error) {
                console.error('Không thể chỉnh sửa nội dung của iframe:', error);
            }
        };

        iframe.addEventListener('load', onLoad);
        return () => {
            iframe.removeEventListener('load', onLoad);
        };
    }, []);

    return (
        <div>
            <iframe 
                ref={iframeRef}
                src="https://genk.vn/" 
                
                width="100%" 
                height="600px" 
                title="Genk"
                style={{ border: 'none' }}
            />
        </div>
    );
};

export default News;
