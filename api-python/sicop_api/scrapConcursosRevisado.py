import time
import pandas as pd

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def declare() -> object:
    global data
    data = dict()
    data['Funcionarios relacionados'] = list()
    data['Fecha/hora de publicación'] = list()
    data['Número de procedimiento'] = list()
    data['Nombre de la institución'] = list()
    data['Encargado de publicación, gestión de objeciones y apertura'] = list()
    data['Encargado de solicitar estudio de ofertas/recomendación de adjudicación'] = list()
    data['Versiones del cartel'] = list()
    data['Descripción del procedimiento'] = list()
    data['Clasificación del objeto'] = list()
    data['Tipo de procedimiento'] = list()
    data['Excepción de contratación directa'] = list()
    data['Tipo de modalidad'] = list()
    data['Tipo de recepción de ofertas'] = list()
    data['Inicio de recepción de ofertas'] = list()   
    data['Fecha/hora de apertura de ofertas'] = list()
    data['Presupuesto total estimado'] = list()

    data['Estado del concurso'] = list()
    data['Cartel'] = list()
    data['Número de SICOP'] = list()
    data['Concurso confidencial'] = list()
    data['Elaborador'] = list()
    data['Registro del cartel'] = list()
    data['Versión en consulta'] = list()
    data['Lugar de apertura'] = list()
    data['Cierre de recepción de ofertas'] = list()
    data['Plazo de adjudicación'] = list()    
    data['Presupuesto total estimado USD (Opcional)'] = list()
    data['Vigencia'] = list()
    data['Regiones'] = list()

    data['Detalle de la modalidad de CD'] = list()
    data['Oficio autorización CGR'] = list()
    data['Código BPIP'] = list()
    data['Precalificada Madre'] = list()

def switchFrame(frameName):
    if frameName != 'Default':
        frame = driver.find_element_by_id(frameName)
        driver.switch_to.frame(frame)
    else:
        driver.switch_to.default_content()

def switchWindow(id,original_window):
    wait = WebDriverWait(driver, 10)
    # Almacena el ID de la ventana original
    assert len(driver.window_handles) == 1
    # Haz clic en el enlace el cual abre una nueva ventana
    driver.find_element_by_link_text(id).click()
    # Espera a la nueva ventana o pestaña
    wait.until(EC.number_of_windows_to_be(2))
    for window_handle in driver.window_handles:
        if window_handle != original_window:
            driver.switch_to.window(window_handle)
            break

def addSpace():
    for x in data:
        data[x].append("")


listaProcedimientos=[]



def obtainDataConcursos():
    table = driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/table[2]')
    rows = table.find_elements_by_tag_name('tr')
    for r in rows[1:]:
        columns = r.find_elements_by_tag_name('td')
        listaProcedimientos.append( columns[0].text.split("\n")[0])
        #nombresInst.append(columns[1].text)
        #descripciones.append(columns[2].text)
        #solicitudes.append(columns[3].text)
        #fechas.append(columns[4].text)
        #try:
        #    idInst.append(dictIDInst[columns[1].text])
        #except KeyError:
        #    print("KEY ERROR: {}".format(columns[0].text))
        #    idInst.append("")

    #print(listaProcedimientos)
   # addSpace()

def obtainData(c):
    # Obtener datos de la tabla 1 informacion general.
    tbody = driver.find_element_by_xpath('/html/body/div/div/div[2]/table[3]/tbody')
    rows = tbody.find_elements_by_tag_name('tr')
    addSpace()
    for i in range(1, len(rows) - 1):
        r = rows[i]
        th = r.find_elements_by_tag_name('th')
        td = r.find_elements_by_tag_name('td')

        for j, x in enumerate(th):
            try:
                data[x.text][c] = td[j].text
            except:
                print("Key Error, add " + x.text + " key to data dictionary")
    obtainRegions(c)

    
    
        
def obtainRegions(c,tableNum = 13):
    # Obtener datos de la tabla 9 Regiones
    tbody = driver.find_element_by_xpath('/html/body/div/div/div[2]/table['+str(tableNum)+']/tbody')
    rows = tbody.find_elements_by_tag_name('tr')
    regiones = []
    for i in range(1, len(rows) - 1):
        try:
            r = rows[i]
            checked = r.find_element_by_tag_name('input').is_selected()
            option = r.find_element_by_class_name('eptdl').text
            if checked:
                regiones.append(option)
        except:
            return obtainRegions(c,14)
    data['Regiones'][c] = regiones

def scrapConcursos(codigos,nombre):
    declare()
    #df = pd.read_csv(codigos)
    #numProcs = df["NumProc"].dropna().tolist()

    c = 0
    driver.get(r"https://www.sicop.go.cr/")  # Se obtiene el sitio Web del SICOP
    switchFrame("topFrame")
    concursoTab = driver.find_element_by_xpath('/html/body/div[2]/div/div/div[4]/ul/li[2]/div[1]/a[3]')
    concursoTab.click()
    switchFrame('Default')
    switchFrame('mainFrame')
    switchFrame('rightFrame')

    for i in codigos:
        inputNumProc = driver.find_element_by_name("instCartelNo")
        inputNumProc.clear()
        inputNumProc.send_keys(i)

        driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/p/span/a').click()
        driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/table[2]/tbody/tr[2]/td[2]/a[1]').click()
       
        #original_window = driver.current_window_handle
        #switchWindow(i,original_window)

        obtainData(c)
        #print(data)
        c += 1

        #driver.close()
        #driver.switch_to.window(original_window)
        #driver.back()
        driver.get(r"https://www.sicop.go.cr/")  # Se obtiene el sitio Web del SICOP
        switchFrame("topFrame")
        concursoTab = driver.find_element_by_xpath('/html/body/div[2]/div/div/div[4]/ul/li[2]/div[1]/a[3]')
        concursoTab.click()
        switchFrame('Default')
        switchFrame('mainFrame')
        switchFrame('rightFrame')

    #print(data)

    #nfoCartel = pd.DataFrame.from_dict(data)
    #infoCartel.to_csv(f"{nombre}.csv")


def scrapConcursosFecha(fechaInicio, fechaFinal, csv):
    inputFecha = driver.find_element_by_id('regDtFrom')
    inputFecha.clear()
    inputFecha.send_keys(fechaInicio)

    inputFecha2 = driver.find_element_by_id('regDtTo')
    inputFecha2.clear()
    inputFecha2.send_keys(fechaFinal)

    btn = driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/p/span/a')
    btn.click()
    #numerosProc = list()
    #nombresInst = list()
    #idInst = list()
    #descripciones = list()
    #solicitudes = list()
    #fechas = list()

    table = driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/table[2]')

    pageAmount = int(table.find_element_by_xpath('//*[@id="total"]/span[3]').text)

    #Revisar paginacion
    i = 2
    j = 1

    try:
        # REVISAR ESTO PROBLEMA CON EL CAMBIO DE PAGINA
        while i <= pageAmount:
            nombresInst=None
            idInst=None
            descripciones=None
            solicitudes=None
            fechas=None
            obtainDataConcursos()
            paging = driver.find_element_by_id('paging')
            if j <= 4:
                button = paging.find_element_by_link_text(str(i))
                button.click()
                j += 1
            else:
                j = 1
                nextButton = paging.find_element_by_class_name('page02')
                nextButton.click()
            i += 1
    except:
        print("Error aqui")

    scrapConcursos(listaProcedimientos,"probando")
    #df = pd.DataFrame(
    #    {'NumProc': numerosProc, 'Institucion': nombresInst, 'ID Institucion':idInst ,'Descripcion': descripciones, 'Solicitud': solicitudes,
    #     'Fecha': fechas})
    #print(df)
    df = pd.DataFrame(data)
    df.to_csv(csv, index=False, header=True, encoding = 'utf-8' )
    print("Saved")
    return df


def main(fromDate, toDate):
    global driver
    
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--start-maximized')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--ignore-ssl-errors')
    chrome_options.add_argument('--allow-running-insecure-content')

    #Cambiar la ruta del webdriver
    PATH = r"C:\src\chromedriver.exe"  # Ruta donde se encuentra el webdriver de chrome
    driver = webdriver.Chrome(PATH,chrome_options=chrome_options)  # Creacion del WebDriver Object para el webScraping
    
    driver.get(r"https://www.sicop.go.cr/")  # Se obtiene el sitio Web del SICOP
    switchFrame("topFrame")

    concursoTab = driver.find_element_by_xpath('/html/body/div[2]/div/div/div[4]/ul/li[2]/div[1]/a[3]')
    concursoTab.click()
    switchFrame('Default')
    switchFrame('mainFrame')
    switchFrame('rightFrame')

    tenderResult = scrapConcursosFecha(fromDate, toDate, "to"+ toDate +".csv")
    driver.quit()
    return tenderResult

    #scrapConcursos("E9.csv","C9")
    #print("E9.csv")
    #scrapConcursos("E10.csv", "C10")
    #print("E10.csv")
    #scrapConcursos("E11.csv", "C11")
    #print("E11.csv")
    #scrapConcursos("E12.csv", "C12")
    #print("E12.csv")
    #scrapConcursos("E13.csv", "C13")
    #print("E13.csv")
    #scrapConcursos("E14.csv", "C14")
    #print("E14.csv")
