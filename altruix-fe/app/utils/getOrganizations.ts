
export async function getOrganizations() {
  try {
    // This is a placeholder URL. Replace with the actual API endpoint.
    const response = await fetch('http://localhost:8000/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    return data.organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}
