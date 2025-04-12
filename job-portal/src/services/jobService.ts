import { GOOGLE_API_KEY, GOOGLE_CSE_ID, JOBS_API_URL } from '@/config/api';

export interface JobSearchParams {
  query?: string;
  location?: string;
  type?: string;
  experienceLevel?: string;
  salary?: string;
  page?: number;
  limit?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
  logo: string;
  url: string;
}

export const jobService = {
  async searchJobs(params: JobSearchParams): Promise<{ jobs: Job[]; total: number }> {
    try {
      const searchParams = new URLSearchParams({
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CSE_ID,
        q: params.query || '',
        location: params.location || '',
        type: params.type || '',
        start: ((params.page || 1) - 1) * (params.limit || 10) + 1,
        num: params.limit || 10,
      });

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      
      // Transform the Google Custom Search results into our Job interface
      const jobs: Job[] = data.items?.map((item: any) => ({
        id: item.cacheId,
        title: item.title,
        company: item.pagemap?.metatags?.[0]?.['og:site_name'] || 'Unknown Company',
        location: item.pagemap?.metatags?.[0]?.['og:description']?.split(' in ')[1] || 'Location not specified',
        type: item.pagemap?.metatags?.[0]?.['og:type'] || 'Full-time',
        description: item.snippet,
        requirements: item.pagemap?.metatags?.[0]?.['og:description']?.split('Requirements:')[1]?.split(',') || [],
        salary: item.pagemap?.metatags?.[0]?.['og:description']?.match(/\$[\d,]+/)?.[0] || 'Salary not specified',
        postedDate: new Date().toISOString(),
        logo: item.pagemap?.cse_image?.[0]?.src || 'https://via.placeholder.com/50',
        url: item.link,
      })) || [];

      return {
        jobs,
        total: data.searchInformation?.totalResults || 0,
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { jobs: [], total: 0 };
    }
  },

  async getJobDetails(jobId: string): Promise<Job | null> {
    try {
      const response = await fetch(
        `${JOBS_API_URL}/jobs/${jobId}?key=${GOOGLE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return null;
    }
  },
}; 