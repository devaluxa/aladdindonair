export interface EnquiryValues {
 name: string;
 email: string;
 tel: string;
 message: string;
}

export function buildEnquiryPayload(values: EnquiryValues, pageUrl: string, timeOnPageMs: number) {
 const fields = [
  { id: 'full_name', label: 'Name', type: 'text', value: values.name.trim() },
  { id: 'email', label: 'Email', type: 'email', value: values.email.trim() },
  { id: 'phone', label: 'Tel', type: 'tel', value: values.tel.trim() },
  { id: 'message', label: 'Message', type: 'textarea', value: values.message.trim() }
 ];
 if (fields.some(field => !field.value)) throw new Error('Please complete all four fields.');
 const url = new URL(pageUrl);
 return { fields, pageUrl: url.origin + url.pathname, timeOnPageMs: Math.max(0, Math.round(timeOnPageMs)) };
}

export async function sendEnquiry(
 endpoint: string,
 payload: ReturnType<typeof buildEnquiryPayload>,
 requestKey: string,
 fetcher: typeof fetch = fetch
) {
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), 20000);
 try {
  const response = await fetcher(endpoint, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey },
   body: JSON.stringify(payload),
   signal: controller.signal
  });
  const result = await response.json().catch(() => null) as { success?: boolean; error?: unknown; status?: string } | null;
  if (response.status === 429) throw new Error('Too many enquiries have been submitted. Please wait a few minutes and try again.');
  if (!response.ok || result?.success === false || result?.error || result?.status === 'error') {
   throw new Error('Your enquiry could not be sent. Please try again or call (780) 458-0201.');
  }
 } finally {
  clearTimeout(timeout);
 }
}
