import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/admin';
import { withLogger } from '@/lib/logs/withLogger';

export const GET = withLogger('/api/social-media-agent/stream/get-feedback-link', async (req: NextRequest, routeLogger) => {
  const { searchParams } = new URL(req.url);
  const streamItemId = searchParams.get('id');

  if (!streamItemId) {
    return new NextResponse('Missing stream item ID', { status: 400 });
  }

  try {
    // 1. Fetch the item and its connected channel token
    const { data: item, error: itemErr } = await supabase
      .from('stream_items')
      .select(`
        external_id,
        channels!inner(platform, encrypted_access_token)
      `)
      .eq('id', streamItemId)
      .single();

    if (itemErr || !item) {
      routeLogger.error({ err: itemErr }, 'Stream item or channel not found');
      return new NextResponse('Not found', { status: 404 });
    }

    const channelData = Array.isArray(item.channels) ? item.channels[0] : item.channels;

    if (!channelData) {
      routeLogger.error('Channel data is missing from the stream item join');
      return new NextResponse('Channel Not found', { status: 404 });
    }

    const platform = channelData.platform;
    const token = channelData.encrypted_access_token;

    let redirectUrl = '';

    // 2. Ask Meta for the live permalink
    if (platform === 'facebook') {
      const fbRes = await fetch(`https://graph.facebook.com/v21.0/${item.external_id}?fields=permalink_url&access_token=${token}`);
      const fbData = await fbRes.json();
      if (fbData.permalink_url) redirectUrl = fbData.permalink_url;
    } else if (platform === 'instagram') {
      const igRes = await fetch(`https://graph.facebook.com/v21.0/${item.external_id}?fields=media{permalink}&access_token=${token}`);
      const igData = await igRes.json();
      if (igData.media?.permalink) redirectUrl = igData.media.permalink;
    }

    // 3. Fallback if Meta fails to provide the deep link
    if (!redirectUrl) {
      redirectUrl = platform === 'instagram' ? 'https://instagram.com' : 'https://facebook.com';
    }

    // 4. Perform the instant redirect
    routeLogger.info({ event: 'permalink_redirect_success', redirectUrl });
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    routeLogger.error({ err: error }, 'Failed to fetch permalink');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
});