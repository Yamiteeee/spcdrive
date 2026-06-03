import { FileItem, DownloadLog, UserManagementData } from '@/types/dashboard';

// Added password field to the type for mock purposes
export type MockUser = UserManagementData & { password?: string };

export const MOCK_FILES: FileItem[] = [
  {
    id: '1', name: 'SPC_System_Core_v2.bin', size: '1.2 GB', type: 'EXE', updatedAt: '2026-05-12', url: '/files/SPC_System_Core_v2.bin',
    category: ''
  },
  {
    id: '2', name: 'Database_Backup_May.sql', size: '450 MB', type: 'SQL', updatedAt: '2026-05-10', url: '/files/Database_Backup_May.sql',
    category: ''
  },
  {
    id: '3', name: 'UI_Brand_Guidelines.pdf', size: '12 MB', type: 'PDF', updatedAt: '2026-05-08', url: '/files/UI_Brand_Guidelines.pdf',
    category: ''
  },
  {
    id: '4', name: 'Network_Topology_Map.svg', size: '2.4 MB', type: 'SVG', updatedAt: '2026-05-09', url: '/files/Network_Topology_Map.svg',
    category: ''
  },
];

export const MOCK_LOGS: DownloadLog[] = [
  { id: 1, user: 'Jason (Admin)', file: 'SPC_System_Core_v2.bin', timestamp: '2026-05-12 14:30', ip: '192.168.1.1', status: 'verified' },
  { id: 2, user: 'Standard Operative', file: 'UI_Brand_Guidelines.pdf', timestamp: '2026-05-11 09:15', ip: '192.168.1.45', status: 'verified' },
   { id: 3, user: 'Standard Operative', file: 'UI_nang.PDF', timestamp: '2026-05-11 09:15', ip: '192.168.1.45', status: 'verified' },
];

export const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Jason (Admin)', email: 'jason@test', role: 'admin', status: 'active', password: '123' },
  { id: '2', name: 'Sarah Miller', email: 'user@test', role: 'user', status: 'active', password: '123' },
  { id: '3', name: 'Marcus Chen', email: 'm.chen@spc.drive', role: 'user', status: 'active', password: '123' },
  { id: '4', name: 'Elena Rodriguez', email: 'e.rodriguez@spc.drive', role: 'user', status: 'pending', password: '123' },
  { id: '5', name: 'David Park', email: 'd.park@spc.drive', role: 'user', status: 'active', password: '123' },
  { id: '6', name: 'Aaliyah Jones', email: 'a.jones@spc.drive', role: 'user', status: 'disabled', password: '123' },
  { id: '7', name: 'Kevin Smyth', email: 'k.smyth@spc.drive', role: 'user', status: 'active', password: '123' },
  { id: '8', name: 'Hana Sato', email: 'h.sato@spc.drive', role: 'user', status: 'active', password: '123' },
  { id: '9', name: 'Tom Baker', email: 't.baker@spc.drive', role: 'user', status: 'pending', password: '123' },
  { id: '10', name: 'Lisa Wong', email: 'l.wong@spc.drive', role: 'user', status: 'active', password: '123' },
];

