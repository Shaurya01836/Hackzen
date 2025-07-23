import React from "react";

export default function PreviewCertificate({ imageUrl, fields }) {
return (
<div className="relative w-full max-w-4xl mx-auto border shadow-lg rounded-md overflow-hidden">
{/* Background certificate image */}
<img src={imageUrl} alt="Certificate Template" className="w-full object-contain" />
{/* Overlay text fields */}
  <div className="absolute inset-0">
    {fields.map((field, idx) => (
      <div
        key={idx}
        className="absolute"
        style={{
          top: `${field.y}px`,
          left: `${field.x}px`,
          fontSize: `${field.fontSize}px`,
          color: field.color,
          fontWeight: field.fontWeight,
          whiteSpace: "nowrap"
        }}
      >
        {field.value}
      </div>
    ))}
  </div>
</div>
);
}
