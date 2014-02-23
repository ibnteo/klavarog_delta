<?php
header('content-type: text/plain; charset=utf-8');
if ($_GET['name'] == 'greatwords') {
    $filename = 'greatwords_ru_rss.txt';
    $url = 'http://greatwords.ru/rss/';
} else {
    $filename = 'bash_org_ru_rss.txt';
    $url = 'http://bash.org.ru/rss';
}
$modify = filemtime($filename);
$now = time();
$is_hour = (($now - $modify) > (60 * 60));
if ($is_hour) {
    $rss = new SimpleXMLElement($url, null, true);
    $file = @fopen($filename, 'w');
    foreach($rss->channel->item as $item) {
        $str = symb_replace($item->description);
        
        if ($filename == 'greatwords_ru_rss.txt') {
            $title = symb_replace($item->title);
            $stitle = split(' - ', $title);
            $str .= ' '.$stitle[1].'.';
        }
        @fwrite($file, $str."\n");
    }
    @fclose($file);
}
$response = @file($filename);
echo(implode("", $response));

function symb_replace($str) {
    $str = htmlspecialchars_decode(preg_replace('/<[^>]+>/', ' ', preg_replace('/<br\/?>/i', "¶", $str)));
    $str = str_replace('…', '...', $str);
    $str = str_replace('—', '-', $str);
    $str = str_replace('«', '"', $str);
    $str = str_replace('»', '"', $str);
    return $str;
}