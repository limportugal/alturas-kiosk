 
import { Icon, icons} from "@/Kiosk-Admin/utils/icon";

export function Modal({ title, onClose, children, footer }: { title:string; onClose:()=>void; children:React.ReactNode; footer?:React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ background:"rgba(255,255,255,0.15)", color:"#fff", padding:"4px 8px" }}>
            <Icon d={icons.x} size={14}/>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
 
export function FormRow({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
 
export function PageHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
      <div>
        <h1 style={{ fontSize:24, fontWeight:700, color:"var(--text)", fontFamily:"'DM Serif Display',serif" }}>{title}</h1>
        {subtitle && <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
 
export function EmptyTable({ label }: { label:string }) {
  return (
    <tr><td colSpan={99} style={{ textAlign:"center", padding:"48px", color:"var(--text-muted)", fontSize:14 }}>
      No {label} found.
    </td></tr>
  );
}
 