export const exportVolunteerListToCSV = (eventTitle, volunteerList) => {
  const headers = ['Volunteer Name', 'Email', 'Role', 'Organization', 'Status'];
  
  const rows = volunteerList.map(v => [
    `"${v.name || 'Volunteer'}"`,
    `"${v.email || 'N/A'}"`,
    `"${v.role || 'Volunteer'}"`,
    `"${v.organization || 'General Volunteer'}"`,
    `"${v.attended ? 'Attended' : 'Registered'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_volunteers.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
