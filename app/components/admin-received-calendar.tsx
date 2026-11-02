import {useState} from 'react';
import {Form,Link} from 'react-router';
import type {DateRange} from 'react-day-picker';
import {Calendar} from './ui/calendar';
import {facilityToday,isCalendarDate} from '../lib/calendar';
const local=(value:string)=>{const [y,m,d]=value.split('-').map(Number);return new Date(y,m-1,d,12);};
const iso=(value?:Date)=>value?`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`:'';
export function AdminReceivedCalendar({base,filters}:{base:string;filters:Record<string,string>}) {
 const [range,setRange]=useState<DateRange|undefined>(()=>isCalendarDate(filters.from||'')?{from:local(filters.from),to:isCalendarDate(filters.to||'')?local(filters.to):undefined}:undefined);
 const reset=new URLSearchParams(filters);reset.delete('from');reset.delete('to');reset.delete('page');
 return <section className="workspace-calendar"><header><h3>Received dates</h3><p>Filter inquiries by date range.</p></header><Form method="get" action={base}>
  {Object.entries(filters).filter(([key])=>!['from','to','page'].includes(key)).map(([key,value])=><input key={key} type="hidden" name={key} value={value}/>)}
  <input type="hidden" name="from" value={iso(range?.from)}/><input type="hidden" name="to" value={iso(range?.to)}/>
  <Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={local(isCalendarDate(filters.from||'')?filters.from:facilityToday())} captionLayout="dropdown" startMonth={new Date(2000,0)} endMonth={new Date(2100,11)} className="sbh-calendar"/>
  <div className="calendar-range-caption" aria-live="polite">{range?.from?`${iso(range.from)}${range.to?' → '+iso(range.to):' onward'}`:'All received dates'}</div>
  <footer><button className="admin-button" disabled={!range?.from}>Apply dates</button><Link to={`${base}${reset.size?'?'+reset.toString():''}`}>Clear</Link></footer>
 </Form></section>;
}
