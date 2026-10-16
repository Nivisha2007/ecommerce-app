import React from "react";
function Input({ label, value, onChange, type = "text", placeholder = "", name, required = false }) {
  return <label className="input-field">{label}<input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} /></label>;
}
export default Input;