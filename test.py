from FlaskAplication.test.mainApp import FlskSevrev

PRIVATEKEY = {
    'd': 84326696142443106196457036004282492292894078482308342653141968878158992832482105614103381157012692509311980744172615285594801602686024308134750710897571203006874193263964294362244845730035157016696032200127519780946929403904617810844535203808165976261348031509760107946516379696705569589278980352332806531073,
    'n': 130207301034004661455027913688923327146343398866625243908655292016961311687455936189602612639881746041437642117397999433889984747790829683399942449818446067929003127144782759564471484412125307160062468145732861525984991405836950669766085891756502788398772584383449300023796025235227753602387780436256335801097,
    'e': 65537,
    'p': 10112634262951768124520862351115409096723023012066514400079265412425140031791210502162323933247000092094637371880135314987109431141469782333230150925673801,
    'q': 12875705543018280209456519310127144207670966327667670132733970570585076879827822422301386773349092583846143797988296481132928760684459139785738033712322497
}

if __name__ == '__main__':
    flsk = FlskSevrev(C2Private=PRIVATEKEY)
    flsk.app.run('0.0.0.0',5000)
